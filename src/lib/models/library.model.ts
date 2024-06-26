import mongoose, {Document, Model} from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export enum LibraryStatus {
  OPENING = 'opening',
  TEMPORARY_CLOSED = 'temporary_closed',
  CLOSED = 'closed'
}

export interface Location {
  _id?: any;
  name: string;
  openingTime: string;
  closingTime: string;
  phoneNumber: string;
  address: string;
  status: LibraryStatus;
  estDate: Date;
  description: string;
  isDelete?: boolean;
}

const LocationSchema = new mongoose.Schema<Location>({
  name: String,
  openingTime: String,
  closingTime: String,
  phoneNumber: String,
  description: String,
  address: String,
  status: {
    type: String,
    enum: Object.values(LibraryStatus),
  },
  estDate: Date,
  isDelete: Boolean
}, {timestamps: true});

export interface LibraryDocument extends Document, Location {
}

LocationSchema.plugin(paginate);

let model;

try {
  model = mongoose.model('Location');
} catch (e) {
  model = mongoose.model('Location', LocationSchema);
}

export const LocationModel = model as Model<Location>;
