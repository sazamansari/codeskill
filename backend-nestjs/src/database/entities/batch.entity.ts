import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, BeforeInsert } from 'typeorm';
import { User } from './user.entity';
import { University } from './university.entity';
import * as crypto from 'crypto';

@Entity('batches')
@Index(['university_id', 'name'], { unique: true })
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @ManyToOne(() => University, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'university_id' })
  university: University;

  @Column()
  university_id: string;

  @Column()
  name: string;

  @Column({ default: '' })
  department: string;

  @Column()
  graduationYear: number;

  @Column({ unique: true })
  inviteCode: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column()
  created_by_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateInviteCode() {
    if (!this.inviteCode) {
      const uniqueString = crypto.randomBytes(4).toString('hex').toUpperCase();
      this.inviteCode = `${this.graduationYear}-${uniqueString}`;
    }
  }
}
