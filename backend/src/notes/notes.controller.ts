import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './note.entity';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() note: { title: string; content: string }) {
    const newNote: Partial<Note> = {
      title: note.title,
      content: note.content,
      archived: false,
    };
    return this.notesService.create(newNote);
  }

  @Get()
  async findAll() {
    return this.notesService.findAll();
  }

  @Get('archived')
  async findArchived() {
    return this.notesService.findArchived();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedNote: { title: string; content: string },
  ) {
    const noteId = parseInt(id, 10);
    try {
      return this.notesService.update(noteId, updatedNote);
    } catch (error) {
      throw new NotFoundException('Note not found');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const noteId = parseInt(id, 10);
    try {
      await this.notesService.remove(noteId);
    } catch (error) {
      throw new NotFoundException('Note not found');
    }
  }

  @Put(':id/archive')
  async archive(@Param('id') id: string) {
    const noteId = parseInt(id, 10);
    try {
      return this.notesService.archive(noteId);
    } catch (error) {
      throw new NotFoundException('Note not found');
    }
  }

  @Put(':id/unarchive')
  async unarchive(@Param('id') id: string) {
    const noteId = parseInt(id, 10);
    try {
      return this.notesService.unarchive(noteId);
    } catch (error) {
      throw new NotFoundException('Note not found');
    }
  }

  @Post(':id/categories')
  addCategory(@Param('id') id: string, @Body('category') category: string) {
    const noteId = parseInt(id, 10);
    return this.notesService.addCategory(noteId, category);
  }

  @Delete(':id/categories')
  removeCategory(@Param('id') id: string, @Body('category') category: string) {
    const noteId = parseInt(id, 10);
    return this.notesService.removeCategory(noteId, category);
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    return this.notesService.findByCategory(category);
  }

  @Get('/all')
  async getAllNotes(): Promise<Note[]> {
    return this.notesService.findAllNotes();
  }
}
