import {Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: string
}
