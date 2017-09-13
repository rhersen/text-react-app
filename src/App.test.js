import transform from "./grid";

it("should", () => {
  expect(transform("nw")).toBe("translate(5,5)");
  expect(transform("ne")).toBe("translate(190,5)");
  expect(transform("se")).toBe("translate(190,375)");
  expect(transform("sw")).toBe("translate(5,375)");
});
