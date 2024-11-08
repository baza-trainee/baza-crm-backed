import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
@Entity()
export class Karma {
  @ManyToOne(() => Project, (project) => project.projectRequirments, {
    onDelete: 'CASCADE',
  })
  project!: Project;
  @PrimaryColumn()
  projectId!: number;

  @ManyToOne(() => User, (user) => user.karmaGivers)
  karmaGiver!: User;
  @PrimaryColumn()
  karmaGiverId!: number;

  @ManyToOne(() => User, (user) => user.karmaReceivers)
  karmaReceiver!: User;
  @PrimaryColumn()
  karmaReceiverId!: number;

  @Column()
  points!: number;
}
