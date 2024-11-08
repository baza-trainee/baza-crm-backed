import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../project.entity';
import { Tag } from '../../tag/tag.entity';
import { User } from '../../user/user.entity';
import { ProjectAplicationState } from './project-aplication.enums';
@Entity()
export class ProjectAplication {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(() => Project, (project) => project.projectAplications, {onDelete:'CASCADE'})
  @JoinColumn({ name: 'projectId' })
  project!: Project;
  @PrimaryColumn()
  projectId!: number;
  @ManyToOne(() => Tag, (tag) => tag.projectAplications)
  tag!: Tag;
  @PrimaryColumn()
  tagId!: number;
  @ManyToOne(() => User, (user) => user.projectAplications)
  @JoinColumn({ name: 'userId' })
  user!: User;
  @PrimaryColumn()
  userId!: number;
  @Column({
    type: 'enum',
    enum: ProjectAplicationState,
    default: ProjectAplicationState.WAITING,
  })
  state!: ProjectAplicationState;
}
