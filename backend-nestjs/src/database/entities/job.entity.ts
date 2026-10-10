import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Company } from './company.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', default: [] })
  skills: string[];

  @Column({ default: 'Entry Level' })
  experienceLevel: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  salaryRange: any;

  @Column({ nullable: true })
  location: string;

  @Column({ default: 'Remote' })
  workplaceType: string;

  @Column({ default: 'Full-time' })
  employmentType: string;

  @Column({ default: 'Published' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  applicationDeadline: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column()
  created_by_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
