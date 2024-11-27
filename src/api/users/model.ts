import { ObjectId, Schema, model } from 'mongoose'

export type IUserSchema = {
	_id: ObjectId
	name: string
	email: string
	password: string
	createdAt: Date
	updatedAt: Date
}

const UserSchema = new Schema<IUserSchema>(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{ timestamps: true, versionKey: false }
)

export const User = model<IUserSchema>('User', UserSchema, 'users')
export type IUser = InstanceType<typeof User>
