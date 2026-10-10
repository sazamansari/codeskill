import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { Company } from './company.entity';
import { Job } from './job.entity';

@Entity('applications')
@Index(['job_id', 'user_id'], { unique: true })
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column()
  job_id: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column({ default: 'Applied' })
  stage: string;

  @Column({ default: '' })
  resumeUrl: string;

  @Column({ type: 'text', default: '' })
  coverLetter: string;

  @Column({ type: 'text', default: '' })
  notes: string;

  @Column({ type: 'float', nullable: true })
  assessmentScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
