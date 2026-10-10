import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { University } from './university.entity';
import { Batch } from './batch.entity';

@Entity('student_enrollments')
@Index(['batch_id', 'student_id'], { unique: true })
@Index(['university_id', 'student_id'], { unique: true })
export class StudentEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @ManyToOne(() => University, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'university_id' })
  university: University;

  @Column()
  university_id: string;

  @ManyToOne(() => Batch, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column()
  batch_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column()
  student_id: string;

  @Column({ default: '' })
  rollNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
