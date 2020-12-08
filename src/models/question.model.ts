import { model, Schema, Document } from 'mongoose';

const questionSchema = new Schema({
  number: {
    type: Number,
    required: true,
    trim: true
  },
  annotations: {
    type: [Schema.Types.ObjectId],
    default: [],
    index: true
  }
});

interface QuestionDocument extends Document {
  number: number;
  annotations: string[];
}

const questionModel = model<QuestionDocument>('Question', questionSchema);

export default questionModel;
