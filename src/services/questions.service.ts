import { LoggerProvider } from '../providers/logger.provider';
import fs from 'fs';
import path from 'path';
import * as csv from 'fast-csv';
import bunyan from 'bunyan';
import mongoose from 'mongoose';
import topicModel from '../models/topic.model';
import questionModel from '../models/question.model';

export class QuestionsService {
  private logger: bunyan;

  constructor() {
    this.logger = new LoggerProvider().getLogger();
  }

  public loadQuestionsFromCSV = async () => {
    await mongoose.connections[0].db.dropCollection('questions');
    fs.createReadStream(path.resolve(__dirname, '../assets', 'questions.csv'))
      .pipe(csv.parse({ headers: true }))
      .on('data', async (row) => {
        const annotations = [];
        const questionNumber = row['Question number'].trim();

        for (let i = 1; i <= 5; i += 1) {
          if (row[`Annotation ${ i }`]) {
            annotations.push(row[`Annotation ${ i }`].trim().toLowerCase());
          }
        }

        const topics = await topicModel.find({ name: { $in: annotations } });
        const topicsIds = topics.map(q => q._id);

        const question = new questionModel({ number: questionNumber, annotations: [...topicsIds] });
        await question.save();
      })
      .on('error', (err) => {
        this.logger.error(err);
      })
      .on('end', async (rowCount: number) => {
        this.logger.info(`Parsed ${ rowCount } rows`);
      });
  };

  public searchQuestions = async (topicName: string) => {
    let questionsNumbers = [];
    const sanitizedTopicName = topicName.trim().toLowerCase();
    try {
      const topic = await topicModel.findOne({ name: sanitizedTopicName });
      if (topic) {
        const results = await questionModel.aggregate<{ number: number }>([
          {
            $lookup: {
              from: 'topics',
              localField: 'annotations',
              foreignField: '_id',
              as: 'annotation'
            }
          },
          { $match: { 'annotation.path': { $regex: `^${ topic.path }` } } },
          { $project: { number: 1, _id: 0 } },
          { $sort: { number: 1 } }
        ]);
        questionsNumbers = results.map(q => q.number);
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
    return questionsNumbers;
  };
}
