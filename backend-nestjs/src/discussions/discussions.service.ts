import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Discussion,
  DiscussionDocument,
} from '../database/schemas/discussion.schema';
import {
  DiscussionReply,
  DiscussionReplyDocument,
} from '../database/schemas/discussion-reply.schema';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
    @InjectModel(DiscussionReply.name)
    private replyModel: Model<DiscussionReplyDocument>,
  ) {}

  // ── Threads ──────────────────────────────────────────────────────────────

  async getThreads(problemId: string, query: any) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const sort: any =
      query.sort === 'popular' ? { upvotes: -1 } : { createdAt: -1 };

    const filter: any = { problemId };
    if (query.tag && query.tag !== 'all') {
      filter.tags = query.tag;
    }

    const [threads, total] = await Promise.all([
      this.discussionModel
        .find(filter)
        .populate('author', 'name avatar username')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.discussionModel.countDocuments(filter),
    ]);

    return {
      data: threads,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getThread(threadId: string) {
    const thread = await this.discussionModel
      .findById(threadId)
      .populate('author', 'name avatar username')
      .lean();

    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  async createThread(
    userId: string,
    data: { problemId: string; title: string; body: string; tags?: string[] },
  ) {
    if (!data.title?.trim() || !data.body?.trim()) {
      throw new BadRequestException('Title and body are required');
    }

    const thread = await this.discussionModel.create({
      problemId: data.problemId,
      author: userId,
      title: data.title.trim(),
      body: data.body.trim(),
      tags: data.tags || ['general'],
    });

    return this.discussionModel
      .findById(thread._id)
      .populate('author', 'name avatar username')
      .lean();
  }

  async deleteThread(userId: string, threadId: string) {
    const thread = await this.discussionModel.findById(threadId);
    if (!thread) throw new NotFoundException('Thread not found');
    if (thread.author.toString() !== userId)
      throw new ForbiddenException('Not authorized');

    await this.replyModel.deleteMany({ discussion: threadId });
    await thread.deleteOne();

    return { deleted: true };
  }

  async voteThread(userId: string, threadId: string, direction: 'up' | 'down') {
    const thread = await this.discussionModel.findById(threadId);
    if (!thread) throw new NotFoundException('Thread not found');

    const userOid = new Types.ObjectId(userId);
    const alreadyUpvoted = thread.upvotedBy.some((id) => id.equals(userOid));
    const alreadyDownvoted = thread.downvotedBy.some((id) =>
      id.equals(userOid),
    );

    if (direction === 'up') {
      if (alreadyUpvoted) {
        // Remove upvote
        thread.upvotedBy = thread.upvotedBy.filter((id) => !id.equals(userOid));
        thread.upvotes = Math.max(0, thread.upvotes - 1);
      } else {
        // Add upvote, remove downvote if present
        if (alreadyDownvoted) {
          thread.downvotedBy = thread.downvotedBy.filter(
            (id) => !id.equals(userOid),
          );
          thread.downvotes = Math.max(0, thread.downvotes - 1);
        }
        thread.upvotedBy.push(userOid);
        thread.upvotes += 1;
      }
    } else {
      if (alreadyDownvoted) {
        thread.downvotedBy = thread.downvotedBy.filter(
          (id) => !id.equals(userOid),
        );
        thread.downvotes = Math.max(0, thread.downvotes - 1);
      } else {
        if (alreadyUpvoted) {
          thread.upvotedBy = thread.upvotedBy.filter(
            (id) => !id.equals(userOid),
          );
          thread.upvotes = Math.max(0, thread.upvotes - 1);
        }
        thread.downvotedBy.push(userOid);
        thread.downvotes += 1;
      }
    }

    await thread.save();
    return { upvotes: thread.upvotes, downvotes: thread.downvotes };
  }

  // ── Replies ──────────────────────────────────────────────────────────────

  async getReplies(threadId: string) {
    const thread = await this.discussionModel.findById(threadId);
    if (!thread) throw new NotFoundException('Thread not found');

    return this.replyModel
      .find({ discussion: threadId })
      .populate('author', 'name avatar username')
      .sort({ createdAt: 1 })
      .lean();
  }

  async createReply(
    userId: string,
    threadId: string,
    data: { body: string; parentReply?: string },
  ) {
    const thread = await this.discussionModel.findById(threadId);
    if (!thread) throw new NotFoundException('Thread not found');

    if (!data.body?.trim()) {
      throw new BadRequestException('Reply body is required');
    }

    const reply = await this.replyModel.create({
      discussion: threadId,
      author: userId,
      body: data.body.trim(),
      parentReply: data.parentReply || null,
    });

    thread.replyCount += 1;
    await thread.save();

    return this.replyModel
      .findById(reply._id)
      .populate('author', 'name avatar username')
      .lean();
  }

  async deleteReply(userId: string, replyId: string) {
    const reply = await this.replyModel.findById(replyId);
    if (!reply) throw new NotFoundException('Reply not found');
    if (reply.author.toString() !== userId)
      throw new ForbiddenException('Not authorized');

    await this.discussionModel.findByIdAndUpdate(reply.discussion, {
      $inc: { replyCount: -1 },
    });

    await reply.deleteOne();
    return { deleted: true };
  }

  async voteReply(userId: string, replyId: string, direction: 'up' | 'down') {
    const reply = await this.replyModel.findById(replyId);
    if (!reply) throw new NotFoundException('Reply not found');

    const userOid = new Types.ObjectId(userId);
    const alreadyUpvoted = reply.upvotedBy.some((id) => id.equals(userOid));
    const alreadyDownvoted = reply.downvotedBy.some((id) => id.equals(userOid));

    if (direction === 'up') {
      if (alreadyUpvoted) {
        reply.upvotedBy = reply.upvotedBy.filter((id) => !id.equals(userOid));
        reply.upvotes = Math.max(0, reply.upvotes - 1);
      } else {
        if (alreadyDownvoted) {
          reply.downvotedBy = reply.downvotedBy.filter(
            (id) => !id.equals(userOid),
          );
          reply.downvotes = Math.max(0, reply.downvotes - 1);
        }
        reply.upvotedBy.push(userOid);
        reply.upvotes += 1;
      }
    } else {
      if (alreadyDownvoted) {
        reply.downvotedBy = reply.downvotedBy.filter(
          (id) => !id.equals(userOid),
        );
        reply.downvotes = Math.max(0, reply.downvotes - 1);
      } else {
        if (alreadyUpvoted) {
          reply.upvotedBy = reply.upvotedBy.filter((id) => !id.equals(userOid));
          reply.upvotes = Math.max(0, reply.upvotes - 1);
        }
        reply.downvotedBy.push(userOid);
        reply.downvotes += 1;
      }
    }

    await reply.save();
    return { upvotes: reply.upvotes, downvotes: reply.downvotes };
  }
}
