import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import topicModel from '../models/topic.model';
import bunyan from 'bunyan';
import { LoggerProvider } from '../providers/logger.provider';
import * as mongoose from 'mongoose';

export class TopicsService {
  private logger: bunyan;
  private topicsDocuments = [];

  constructor() {
    this.logger = new LoggerProvider().getLogger();
  }

  public loadTopicsFromCSV = async () => {
    await mongoose.connections[0].db.dropCollection('topics');
    fs.createReadStream(path.resolve(__dirname, '../assets', 'topics.csv'))
      .pipe(csv.parse({ headers: true }))
      .on('data', (row) => {
        const topicLevel1 = row['Topic Level 1'];
        const topicLevel2 = row['Topic Level 2'];
        const topicLevel3 = row['Topic Level 3'];
        this.addToTopicsDocuments(topicLevel1, null);
        this.addToTopicsDocuments(topicLevel2, topicLevel1);
        this.addToTopicsDocuments(topicLevel3, topicLevel2);
      })
      .on('error', (err) => {
        this.logger.error(err);
      })
      .on('end', async (rowCount: number) => {
        for (const topicDoc of this.topicsDocuments) {
          await topicDoc.save();
        }
        this.logger.info(`Parsed ${ rowCount } rows`);
      });
  };

  private addToTopicsDocuments = (topicName: string, topicParentName: string) => {
    const sanitizedTopicName = topicName ? topicName.trim().toLowerCase() : '';
    const sanitizedParentName = topicParentName ? topicParentName.trim().toLowerCase() : '';

    const topicParent = this.topicsDocuments.find(t => t._doc.name === sanitizedParentName);
    const topicDoc = new topicModel({ name: sanitizedTopicName, parent: topicParent });
    if (sanitizedTopicName
      && sanitizedTopicName !== ''
      && !this.topicsDocuments.find(t => t._doc.name === sanitizedTopicName)) {
      this.topicsDocuments.push(topicDoc);
    }
  };
}
