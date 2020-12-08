import { Schema, model, Document } from 'mongoose';
import { NextFunction } from 'express';

const topicSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  parent: {
    type: Schema.Types.ObjectId
  },
  path: {
    type: String,
    index: true
  }
});

interface TopicDocument extends Document {
  name: string;
  parent: string;
  path: string;
}

topicSchema.pre('save', async function preSave(next: NextFunction) {
  const self = this as TopicDocument;
  self.path = self._id.toString();
  if (self.parent) {
    const parentDoc = await this.collection.findOne({ _id: self.parent });
    self.path = `${ parentDoc.path }#${ self.path }`;
  }
  next();
});

const topicModel = model<TopicDocument>('Topic', topicSchema);

export default topicModel;
