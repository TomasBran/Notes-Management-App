import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async findAllNotes(): Promise<Note[]> {
    return await this.notesRepository.find();
  }

  async create(note: Partial<Note>): Promise<Note> {
    const newNote = this.notesRepository.create(note);
    return this.notesRepository.save(newNote);
  }

  async findAll(): Promise<Note[]> {
    return this.notesRepository.find({ where: { archived: false } });
  }

  async update(id: number, updatedNote: Partial<Note>): Promise<Note> {
    const note = await this.notesRepository.preload({
      id,
      ...updatedNote,
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return this.notesRepository.save(note);
  }

  async remove(id: number): Promise<void> {
    const result = await this.notesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Note not found');
    }
  }

  async archive(id: number): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    note.archived = true;
    return this.notesRepository.save(note);
  }

  async unarchive(id: number): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    note.archived = false;
    return this.notesRepository.save(note);
  }

  async findArchived(): Promise<Note[]> {
    return this.notesRepository.find({ where: { archived: true } });
  }

  async addCategory(id: number, category: string): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    if (!note.categories) {
      note.categories = [];
    }
    if (!note.categories.includes(category)) {
      note.categories.push(category);
    }
    return this.notesRepository.save(note);
  }

  async removeCategory(id: number, category: string): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    if (!note.categories) {
      throw new NotFoundException('No categories found for this note');
    }
    note.categories = note.categories.filter((cat) => cat !== category);
    return this.notesRepository.save(note);
  }

  // HABILITAR EN POSTGRE
  //   async findByCategory(category: string): Promise<Note[]> {
  //     return this.notesRepository
  //       .createQueryBuilder('note')
  //       .where(':category = ANY (note.categories)', { category })
  //       .getMany();
  //   }

  async findByCategory(category: string): Promise<Note[]> {
    return this.notesRepository
      .createQueryBuilder('note')
      .where('note.categories LIKE :category', { category: `%${category}%` })
      .getMany();
  }
}
