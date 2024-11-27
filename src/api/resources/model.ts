import { Types, Schema, model, ObjectId } from 'mongoose'

export type IResourceSchema = {
	_id: Types.ObjectId
	user: ObjectId
	file?: string
	link?: string
	url: string
	status: 'active' | 'expired'
	expiry: Date
	createdAt: Date
	updatedAt: Date
}

const ResourceSchema = new Schema<IResourceSchema>(
	{
		user: {
			type: String,
			required: true,
			ref: 'User'
		},
		file: String,
		link: String,
		url: {
			type: String,
			required: true
		},
		status: {
			type: String,
			enum: ['active', 'expired'],
			default: 'active'
		},
		expiry: {
			type: Date,
			required: true
		}
	},
	{ timestamps: true, versionKey: false }
)

export const Resource = model<IResourceSchema>('Resource', ResourceSchema, 'resources')
export type IResource = InstanceType<typeof Resource>
