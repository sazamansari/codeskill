import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProblemMetadata,
  ProblemMetadataDocument,
} from '../database/schemas/problem-metadata.schema';
import { CacheService } from '../redis/cache.service';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectModel(ProblemMetadata.name)
    private problemModel: Model<ProblemMetadataDocument>,
    private cacheService: CacheService,
  ) {}

  async getProblems(query: any) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const difficulty = query.difficulty || 'all';
    const category = query.category || 'all';
    const search = query.search || 'none';

    const cacheKey = `problems:${page}:${limit}:${difficulty}:${category}:${search}`;
    const cachedData = await this.cacheService.get<any>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const filter: any = {
      $or: [
        { visibility: { $in: ['Published', 'published', 'Public', 'public'] } },
        { visibility: { $exists: false } },
      ],
    };

    if (query.difficulty && query.difficulty !== 'all') {
      filter.difficulty = query.difficulty;
    }

    if (
      query.category &&
      query.category !== 'All Topics' &&
      query.category !== 'all'
    ) {
      filter.categories = { $in: [new RegExp(`^${query.category}$`, 'i')] };
    }

    if (
      query.search &&
      typeof query.search === 'string' &&
      query.search.trim() &&
      query.search !== 'none'
    ) {
      const s = query.search.trim();
      filter.$and = [
        {
          $or: [
            { title: { $regex: s, $options: 'i' } },
            { slug: { $regex: s, $options: 'i' } },
            { tags: { $in: [new RegExp(s, 'i')] } },
          ],
        },
      ];
    }

    const [problems, total] = await Promise.all([
      this.problemModel
        .find(filter)
        .select(
          'title slug difficulty categories tags stats createdAt updatedAt',
        )
        .sort({ createdAt: -1, _id: -1 })
        .skip(startIndex)
        .limit(limit)
        .lean(),
      this.problemModel.countDocuments(filter),
    ]);

    const result = {
      count: problems.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      totalPages: Math.ceil(total / limit) || 1,
      data: problems,
    };

    await this.cacheService.set(cacheKey, result, 300); // cache for 5 min
    return result;
  }

  async getProblemBySlug(slug: string) {
    const cacheKey = `problem:${slug}`;
    const cachedData = await this.cacheService.get<any>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    let problem = await this.problemModel
      .findOne({
        slug,
        $or: [
          {
            visibility: { $in: ['Published', 'published', 'Public', 'public'] },
          },
          { visibility: { $exists: false } },
        ],
      })
      .populate('statement')
      .populate('config')
      .populate('testCases')
      .lean();

    if (!problem) {
      // Fallback in case visibility is not strictly matched
      problem = await this.problemModel
        .findOne({ slug })
        .populate('statement')
        .populate('config')
        .populate('testCases')
        .lean();
    }

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    // Don't leak reference solutions or hidden test cases in public API
    if (problem.config && (problem.config as any).referenceSolution) {
      delete (problem.config as any).referenceSolution;
    }

    if (problem.testCases && (problem.testCases as any).cases) {
      (problem.testCases as any).cases = (
        problem.testCases as any
      ).cases.filter((c: any) => !c.isHidden);
    }

    await this.cacheService.set(cacheKey, { data: problem }, 3600); // Cache for 1 hour
    return { data: problem };
  }
}
