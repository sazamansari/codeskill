import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { University } from './university.entity';

@Entity('university_users')
@Index(['university_id', 'user_id'], { unique: true })
export class UniversityUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @ManyToOne(() => University, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'university_id' })
  university: University;

  @Column()
  university_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column({ default: 'Professor' })
  role: string;

  @Column({ default: '' })
  department: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
