import MousePoint from './MousePoint';

describe('MousePoint', () => {
  it('should calculate euclidean distance correctly', () => {
    const point1 = new MousePoint(0, 0);
    const point2 = new MousePoint(3, 4);

    expect(point1.euclideanDistance(point2)).toBe(5);
  });

  it('should return correct direction R', () => {
    const point1 = new MousePoint(0, 0);
    const point2 = new MousePoint(10, 0);

    expect(point1.direction(point2)).toBe('R');
  });

  it('should return correct direction D', () => {
    const point1 = new MousePoint(0, 0);
    const point2 = new MousePoint(0, 10);

    expect(point1.direction(point2)).toBe('D');
  });

  it('should return correct direction U', () => {
    const point1 = new MousePoint(0, 0);
    const point2 = new MousePoint(0, -10);

    expect(point1.direction(point2)).toBe('U');
  });

  it('should return correct direction L', () => {
    const point1 = new MousePoint(0, 0);
    const point2 = new MousePoint(-10, 0);

    expect(point1.direction(point2)).toBe('L');
  });
});
