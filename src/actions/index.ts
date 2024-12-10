import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()

const openai = new OpenAI({apiKey: import.meta.env.OPENAI_API_KEY})

const taskSchema = z.object({
	title: z.string().min(1),
	description: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']),
	dueDate: z.date().refine(date => date >= new Date(), {
		message: "Due date must be in the future",
	}),
	completed: z.boolean().default(false)
})

export const server = {
	createTask: defineAction({
		input: z.object({
			title: z.string().min(1),
			description: z.string().optional(),
			priority: z.enum(['low', 'medium', 'high']),
			dueDate: z.string().refine(date => !isNaN(Date.parse(date)), {
				message: "Invalid date format",
			}),
			completed: z.boolean().default(false)
		}),
		handler: async (input) => {
			try {
				const taskData = taskSchema.parse({
					...input,
					dueDate: new Date(input.dueDate)
				})
				const newTask = await prisma.task.create({ data: taskData })
				console.log('The task has been successfully created:', newTask)
				return newTask
			} catch (error) {
				console.error('Error when creating a task:', error)
				throw error
			}
		}
	}),
	fetchAllTasks: defineAction({
		handler: async () => {
			try {
				return await prisma.task.findMany()
			} catch (error) {
				console.error('Failed to fetch tasks:', error)
				return []
			}
		}
	}),
    fetchTaskById: defineAction({
        input: z.object({
            id: z.number()
        }),
        handler: async (input) => {
			try {
                return await prisma.task.findUnique({ where: { id: Number(input.id) } });
			} catch (error) {
				console.error('Error when searching for a task:', error)
				throw error
			}
		} 
    }),
    updateTaskById: defineAction({
        input: z.object({
            id: z.number(),
            data: z.object({
				id: z.number(),
				title: z.string().min(1),
				description: z.string().optional(),
				priority: z.enum(['low', 'medium', 'high']),
				dueDate: z.string().refine(date => !isNaN(Date.parse(date)), {
					message: "Invalid date format",
				}),
				completed: z.boolean().default(false)
			})
        }),
        handler: async (input) => {
			try {
                const taskData = taskSchema.partial().parse({
					...input.data,
					dueDate: new Date(input.data.dueDate)
				});
                const updatedTask = await prisma.task.update({
					where: { id: Number(input.id) },
					data: taskData,
				  });
				console.log('The task has been successfully updated:', updatedTask)
				return updatedTask
			} catch (error) {
				console.error('Error when updating a task:', error)
				throw error
			}
		} 
    }),
    deleteTaskById: defineAction({
        input: z.object({
            id: z.number()
        }),
        handler: async (input) => {
			try {
                return await prisma.task.delete({ where: { id: Number(input.id) } });
			} catch (error) {
				console.error('Error when searching for a task:', error)
				throw error
			}
		} 
    }),
	generateDescription: defineAction({
		input: z.object({
			title: z.string().min(1)
		}),
		handler: async (input) => {
			try {
				const response = await openai.completions.create({
					model: 'gpt-4o-mini',
					prompt: `Generate a detailed description for a task titled "${input.title}"`,
					max_tokens: 150
				})

				console.log('Generated description:', response)

				// return { description: response.choices[0].text.trim() }
			} catch (error) {
				console.error('Ошибка при генерации описания:', error)
				throw error
			}
		}
	})
}
