import { describe, it, expect } from "vitest";
import { assertValidTransition } from "./deliveryStateMachine";
import { TRPCError } from "@trpc/server";

describe("Delivery State Machine", () => {
  it("allows PENDING to ASSIGNED", () => {
    expect(() => assertValidTransition("PENDING", "ASSIGNED")).not.toThrow();
  });

  it("allows ASSIGNED to IN_TRANSIT", () => {
    expect(() => assertValidTransition("ASSIGNED", "IN_TRANSIT")).not.toThrow();
  });

  it("allows IN_TRANSIT to DELIVERED", () => {
    expect(() => assertValidTransition("IN_TRANSIT", "DELIVERED")).not.toThrow();
  });

  it("allows IN_TRANSIT to FAILED", () => {
    expect(() => assertValidTransition("IN_TRANSIT", "FAILED")).not.toThrow();
  });

  it("allows FAILED to PENDING (retry)", () => {
    expect(() => assertValidTransition("FAILED", "PENDING")).not.toThrow();
  });

  it("rejects PENDING directly to DELIVERED", () => {
    expect(() => assertValidTransition("PENDING", "DELIVERED")).toThrow(
      TRPCError
    );
  });

  it("rejects PENDING directly to IN_TRANSIT", () => {
    expect(() => assertValidTransition("PENDING", "IN_TRANSIT")).toThrow();
  });

  it("rejects any transition away from DELIVERED (terminal state)", () => {
    expect(() => assertValidTransition("DELIVERED", "PENDING")).toThrow();
    expect(() => assertValidTransition("DELIVERED", "IN_TRANSIT")).toThrow();
  });

  it("rejects ASSIGNED directly to DELIVERED (skipping IN_TRANSIT)", () => {
    expect(() => assertValidTransition("ASSIGNED", "DELIVERED")).toThrow();
  });
});