import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { ProblemStatement } from './problem-statement.entity';
import { ProblemConfig } from './problem-config.entity';
import { ProblemTestCase } from './problem-testcase.entity';

@Entity('problem_metadata')
export class ProblemMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  mongoId: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: 'Easy' })
  difficulty: string;

  @Column({ type: 'jsonb', default: [] })
  categories: string[];

  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ nullable: true })
  author_id: string;

  @Column({ default: 'Draft' })
  visibility: string;

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'jsonb', default: [] })
  keywords: string[];

  @Column({ type: 'jsonb', default: { totalSubmissions: 0, acceptedSubmissions: 0, acceptanceRate: 0 } })
  stats: Record<string, any>;

  @OneToOne(() => ProblemStatement, statement => statement.metadata)
  statement: ProblemStatement;

  @OneToOne(() => ProblemConfig, config => config.metadata)
  config: ProblemConfig;

  @OneToOne(() => ProblemTestCase, testCases => testCases.metadata)
  testCases: ProblemTestCase;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
