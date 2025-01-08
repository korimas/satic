import { NeonQueryFunction } from '@neondatabase/serverless';
import { SpecComment } from 'src/data/structs';
/*
CREATE TABLE spec_comments (  
  id BIGINT PRIMARY KEY,  
  parent_id BIGINT,  
  spec_item_id BIGINT NOT NULL,
  spec_id BIGINT NOT NULL,  
  reporter_id UUID NOT NULL,
  content TEXT NOT NULL,  
  
  is_edited BOOLEAN DEFAULT FALSE,  
  is_deleted BOOLEAN DEFAULT FALSE,  

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
); 
*/
export class SpecCommentDB {
  static async getCommentById(sql: NeonQueryFunction<any, any>, id: number) {
    const result = await sql`SELECT * FROM spec_comments WHERE id = ${id}`;
    if (!Array.isArray(result) || result.length === 0) {
      throw new Error(`Comment not found: ${id}`);
    }
    return result[0];
  }

  static async getCommentsBySpecItemId(sql: NeonQueryFunction<any, any>, specItemId: number) {
    const result = await sql`
          SELECT * FROM spec_comments WHERE spec_item_id = ${specItemId}
        `;
    if (!Array.isArray(result)) {
      throw new Error(`Comment not found by spec item: ${specItemId}`);
    }
    return result as SpecComment[];
  }

  static async createComment(sql: NeonQueryFunction<any, any>, comment: SpecComment) {
    const result = (await sql`
          INSERT INTO spec_comments (parent_id, spec_item_id, spec_id, reporter_id, content)
          VALUES (${comment.parent_id}, ${comment.spec_item_id}, ${comment.spec_id}, ${comment.reporter_id}, ${comment.content})
          RETURNING *
        `) as any[];

    // 判断成功
    if (result.length === 0) {
      throw new Error('Failed to insert comment');
    }
    return (result as any[])[0];
  }

  static async deleteComment(sql: NeonQueryFunction<any, any>, ids: number[]) {
    const result = await sql`
          DELETE FROM spec_comments
          WHERE id = ANY(${ids}::bigint[])
          RETURNING id
        `;
    return result;
  }
}