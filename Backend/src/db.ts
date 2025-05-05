import { PrismaClient } from "@prisma/client";
import { DatabaseError } from "pg";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

prisma.$connect()
  .then(() => {
    return console.log('Connected to DB');
  })
  // change error with a custom error handler
  .catch((error: DatabaseError) => {
     throw new Error(`Database connection error: ${error} `);
  })

export class DatabaseService {
  // add task
  static async addTask(
    taskName: string,
    taskPriority: string,
    taskProgress: string,
    taskDueDate: Date,
    userId: number
  ) {
    return prisma.task.create({
      data: {
        taskName,
        taskPriority,
        taskProgress,
        taskDueDate,
        user: {
          connect: {
            id: userId
          }
        }
      }
    })
  }
  // Add user
  static async addUser(
    firstName: string,
    lastName: string,
    userName: string,
    userPassword: string,
    userEmail: string
  ) {
    return prisma.user.create({
      data: {
        firstName,
        lastName,
        userName,
        userPassword,
        userEmail,
      },
    });
  }

  // Get all tasks
  static async getTasks() {
    return prisma.task.findMany({
      include: {
        user: true // Include related user data if needed
      }
    })
  }
  // Get all Users
  static async getUsers() {
    return prisma.user.findMany({
      include: {
        tasks: true // Include related task data if needed
      }
    })
  }

  // Get Task by taskName
  static async getTaskByTaskName(taskName: string) {
    return prisma.task.findUnique({
      where: {
        taskName,
      },
      include: {
        user: true // include user data if needed
      }
    })
  }

  // Get User by UserId
  static async getUserByUserId(id: number) {
    return prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        tasks: true // Include user's tasks if needed 
      }
    })
  }

  // Get User by UserName (For Login and JWT Auth)
  static async getUserByUserName(userName: string) {
    return prisma.user.findUnique({
      where: {
        userName
      },
      include: {
        tasks: true
      }
    })
  }

  // Check if User Exists
  static async checkUserExists(userName: string, userEmail: string) {
    return prisma.user.count({
      where: {
        OR: [
          {
            userName: userName
          },
          {
            userEmail: userEmail
          }
        ],
      },
    }).then((count: number) => {
     return count > 0
    })
  }

  // Check if task name already exists
  static async checkTaskNameExists(taskName: string) {
    return prisma.task.count({
      where: {
        AND: [
          {
            taskName: taskName
          },
          {
            taskProgress: {
              not: 'COMPLETED'
            }
          }
        ]
      }
    }).then((count: number) => {
      return count > 0;
    })
  }
}
