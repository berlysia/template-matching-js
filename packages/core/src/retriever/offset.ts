import type { Candidate, Position, Retriever } from "../types";

export class OffsetRetriever implements Retriever {
  #retriever: Retriever;
  #offset: Position;
  constructor(offset: Position, retriever: Retriever) {
    this.#offset = offset;
    this.#retriever = retriever;
  }

  retrieve(candidate: Candidate, score: number) {
    return this.#retriever.retrieve(candidate, score);
  }

  first() {
    const result = this.#retriever.first();
    if (!result) {
      throw new Error("something wrong: result is empty");
    }
    return {
      ...result,
      pos: {
        x: result.pos.x - this.#offset.x,
        y: result.pos.y - this.#offset.y,
      },
    };
  }

  all() {
    return this.#retriever.all().map((v) => ({
      ...v,
      pos: { x: v.pos.x - this.#offset.x, y: v.pos.y - this.#offset.y },
    }));
  }
}
