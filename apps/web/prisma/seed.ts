// Seed initial data for Car Wash System
import { PrismaClient, JobStatus, PaymentMethod, AppointmentStatus, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // Clean up existing data (reverse order due to foreign keys)
  await prisma.appointment.deleteMany({})
  await prisma.job.deleteMany({})
  await prisma.user.deleteMany({})
  
  console.log('🧹 Cleared existing data')
  
  // Create test users (worker and manager)
  const worker = await prisma.user.create({
    data: {
      email: 'worker@carwash.com',
      name: 'Test Worker',
      role: UserRole.worker,
    },
  })
  
  const manager = await prisma.user.create({
    data: {
      email: 'manager@carwash.com',
      name: 'Test Manager',
      role: UserRole.manager,
    },
  })
  
  console.log(`✅ Created users: ${worker.name} (${worker.role}), ${manager.name} (${manager.role})`)
  
  // Create sample jobs for testing Kanban
  const sampleJobs = [
    {
      licensePlate: 'ABC123',
      carBrand: 'Toyota',
      carModel: 'Camry',
      color: 'White',
      status: JobStatus.waiting,
      createdById: worker.id,
    },
    {
      licensePlate: 'XYZ789',
      carBrand: 'Honda',
      carModel: 'Civic',
      color: 'Black',
      status: JobStatus.washing,
      createdById: worker.id,
    },
    {
      licensePlate: 'DEF456',
      carBrand: 'Ford',
      carModel: 'Focus',
      color: 'Blue',
      status: JobStatus.detailing,
      paymentCompleted: true,
      paymentMethod: PaymentMethod.cash,
      paymentAmount: 25.50,
      createdById: worker.id,
    },
    {
      licensePlate: 'GHI789',
      carBrand: 'BMW',
      carModel: 'X5',
      color: 'Silver',
      status: JobStatus.ready_for_pickup,
      paymentCompleted: false, // Testing payment requirement
      createdById: worker.id,
    },
  ]
  
  for (const jobData of sampleJobs) {
    const job = await prisma.job.create({
      data: jobData,
    })
    console.log(`✅ Created job: ${job.licensePlate} (${job.status})`)
  }
  
  // Create sample appointments
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const appointment = await prisma.appointment.create({
    data: {
      customerName: 'John Smith',
      phoneNumber: '+1234567890',
      licensePlate: 'JKL012',
      carBrand: 'Mercedes',
      carModel: 'C-Class',
      color: 'Red',
      serviceType: 'Full Wash + Detailing',
      status: AppointmentStatus.pending,
      scheduledDate: tomorrow,
      scheduledTime: new Date('2026-02-09T10:00:00Z'),
      createdById: worker.id,
    },
  })
  
  console.log(`✅ Created appointment: ${appointment.customerName} for ${appointment.scheduledDate.toDateString()}`)
  
  console.log('🌱 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })