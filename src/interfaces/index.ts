export interface TaskObject {
	title: string
	description: string
	priority: string
	dueDate: Date | string
	completed: boolean
	id?: string
}

export interface FilterObject {
	priority: string
	completed: string
}
