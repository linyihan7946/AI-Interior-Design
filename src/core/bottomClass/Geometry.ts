import * as THREE from 'three';

export class Geometry {
    /**
     * 判断两条线段是共线、平行、相交、还是不平行也不相交
     * @param line1 第一条线段，包含起点和终点
     * @param line2 第二条线段，包含起点和终点
     * @returns 共线、平行、相交、不平行也不相交
     */
    public static lineIntersectionType(
        line1: { start: THREE.Vector2; end: THREE.Vector2 },
        line2: { start: THREE.Vector2; end: THREE.Vector2 }
    ): 'collinear' | 'parallel' | 'intersect' | 'none' {
        const a1 = line1.end.y - line1.start.y;
        const b1 = line1.start.x - line1.end.x;
        const c1 = a1 * line1.start.x + b1 * line1.start.y;

        const a2 = line2.end.y - line2.start.y;
        const b2 = line2.start.x - line2.end.x;
        const c2 = a2 * line2.start.x + b2 * line2.start.y;

        const denominator = a1 * b2 - a2 * b1;

        if (denominator === 0) {
            const isCollinear = (a1 * line2.start.x + b1 * line2.start.y) === c1;
            return isCollinear ? 'collinear' : 'parallel';
        } else {
            const x = (b2 * c1 - b1 * c2) / denominator;
            const y = (a1 * c2 - a2 * c1) / denominator;
            const intersectPoint = new THREE.Vector2(x, y);

            if (this.isPointOnLineSegment(intersectPoint, line1) && this.isPointOnLineSegment(intersectPoint, line2)) {
                return 'intersect';
            } else {
                return 'none';
            }
        }
    }

    /**
     * 判断点到面的距离
     * @param point 点
     * @param planePoint 平面上的点
     * @param planeNormal 平面法向量
     * @returns 点到平面的距离
     */
    public static pointToPlaneDistance(
        point: THREE.Vector3,
        planePoint: THREE.Vector3,
        planeNormal: THREE.Vector3
    ): number {
        const v = point.clone().sub(planePoint);
        return Math.abs(v.dot(planeNormal.normalize()));
    }

    /**
     * 判断两条线条是否平行，允许误差值
     * @param line1 第一条线段的向量
     * @param line2 第二条线段的向量
     * @param epsilon 允许的误差值
     * @returns 是否平行
     */
    public static areLinesParallel(
        line1: THREE.Vector2,
        line2: THREE.Vector2,
        epsilon: number = 1e-6
    ): boolean {
        const crossProduct = Math.abs(line1.cross(line2));
        return crossProduct < epsilon;
    }

    /**
     * 判断点集是否是逆时针
     * @param points 点集
     * @returns 是否逆时针
     */
    public static isCounterClockwise(points: THREE.Vector2[]): boolean {
        let sum = 0;
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            sum += (p2.x - p1.x) * (p2.y + p1.y);
        }
        return sum < 0;
    }

    /**
     * 对点集进行offset，兼容非闭合跟闭合情况
     * @param points 点集
     * @param offset 偏移量
     * @param isClosed 是否闭合
     * @returns 偏移后的点集
     */
    public static offsetPoints(
        points: THREE.Vector2[],
        offset: number,
        isClosed: boolean = true
    ): THREE.Vector2[] {
        const offsetPoints: THREE.Vector2[] = [];
        const length = points.length;

        for (let i = 0; i < length; i++) {
            const prev = points[(i - 1 + length) % length];
            const curr = points[i];
            const next = points[(i + 1) % length];

            const vPrev = curr.clone().sub(prev).normalize();
            const vNext = next.clone().sub(curr).normalize();

            const angle = Math.atan2(vNext.y - vPrev.y, vNext.x - vPrev.x);
            const offsetX = offset * Math.cos(angle);
            const offsetY = offset * Math.sin(angle);

            offsetPoints.push(new THREE.Vector2(curr.x + offsetX, curr.y + offsetY));
        }

        if (!isClosed) {
            offsetPoints[0] = points[0].clone();
            offsetPoints[length - 1] = points[length - 1].clone();
        }

        return offsetPoints;
    }

    /**
     * 判断点是否在线段上
     * @param point 点
     * @param line 线段
     * @returns 是否在线段上
     */
    private static isPointOnLineSegment(
        point: THREE.Vector2,
        line: { start: THREE.Vector2; end: THREE.Vector2 }
    ): boolean {
        const minX = Math.min(line.start.x, line.end.x);
        const maxX = Math.max(line.start.x, line.end.x);
        const minY = Math.min(line.start.y, line.end.y);
        const maxY = Math.max(line.start.y, line.end.y);

        return (
            point.x >= minX && point.x <= maxX &&
            point.y >= minY && point.y <= maxY
        );
    }

    /**
     * 对复合线段进行偏移，支持闭合和非闭合情况
     * @param segments 复合线段，包含直线和圆弧
     * @param offsets 每个线段或圆弧的偏移量
     * @param isClosed 是否闭合
     * @returns 偏移后的复合线段
     */
    public static offsetCompositeLine(
        segments: Array<{ type: 'line' | 'arc', points: THREE.Vector2[], radius?: number, center?: THREE.Vector2 }>,
        offsets: number[],
        isClosed: boolean = true
    ): Array<{ type: 'line' | 'arc', points: THREE.Vector2[], radius?: number, center?: THREE.Vector2 }> {
        const offsetSegments: Array<{ type: 'line' | 'arc', points: THREE.Vector2[], radius?: number, center?: THREE.Vector2 }> = [];

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const offset = offsets[i];

            if (segment.type === 'line') {
                // 处理直线偏移
                const linePoints = segment.points;
                const offsetLinePoints = this.offsetLine(linePoints, offset);
                offsetSegments.push({ type: 'line', points: offsetLinePoints });
            } else if (segment.type === 'arc') {
                // 处理圆弧偏移
                const arcPoints = segment.points;
                const radius = segment.radius || 0;
                const center = segment.center || new THREE.Vector2();
                const offsetArcPoints = this.offsetArc(arcPoints, radius, center, offset);
                offsetSegments.push({ type: 'arc', points: offsetArcPoints, radius: radius + offset, center });
            }

            // 调试信息：检查连续性
            if (i > 0) {
                const prevSegment = offsetSegments[i - 1];
                const currSegment = offsetSegments[i];
                const prevEndPoint = prevSegment.points[prevSegment.points.length - 1];
                const currStartPoint = currSegment.points[0];

                if (!prevEndPoint.equals(currStartPoint)) {
                    console.warn(`Discontinuity detected between segment ${i - 1} and segment ${i}`);
                    // 调整当前线段的起点以与前一个线段的终点匹配
                    currSegment.points[0] = prevEndPoint.clone();
                }
            }
        }

        // 处理非闭合情况
        if (!isClosed) {
            offsetSegments[0].points[0] = segments[0].points[0].clone();
            offsetSegments[offsetSegments.length - 1].points[offsetSegments[offsetSegments.length - 1].points.length - 1] = segments[segments.length - 1].points[segments[segments.length - 1].points.length - 1].clone();
        }

        // 合并相邻的线段以减少线段数目
        const mergedSegments: Array<{ type: 'line' | 'arc', points: THREE.Vector2[], radius?: number, center?: THREE.Vector2 }> = [];
        let currentSegment = offsetSegments[0];

        for (let i = 1; i < offsetSegments.length; i++) {
            const nextSegment = offsetSegments[i];

            if (currentSegment.type === 'line' && nextSegment.type === 'line') {
                // 合并相邻的直线段
                currentSegment.points = currentSegment.points.concat(nextSegment.points.slice(1));
            } else {
                mergedSegments.push(currentSegment);
                currentSegment = nextSegment;
            }
        }

        mergedSegments.push(currentSegment);

        return mergedSegments;
    }

    /**
     * 对直线进行偏移
     * @param points 直线的点集
     * @param offset 偏移量
     * @returns 偏移后的点集
     */
    private static offsetLine(points: THREE.Vector2[], offset: number): THREE.Vector2[] {
        const offsetPoints: THREE.Vector2[] = [];
        const length = points.length;

        for (let i = 0; i < length; i++) {
            const prev = points[(i - 1 + length) % length];
            const curr = points[i];
            const next = points[(i + 1) % length];

            const vPrev = curr.clone().sub(prev).normalize();
            const vNext = next.clone().sub(curr).normalize();

            const angle = Math.atan2(vNext.y - vPrev.y, vNext.x - vPrev.x);
            const offsetX = offset * Math.cos(angle);
            const offsetY = offset * Math.sin(angle);

            offsetPoints.push(new THREE.Vector2(curr.x + offsetX, curr.y + offsetY));
        }

        return offsetPoints;
    }

    /**
     * 对圆弧进行偏移
     * @param points 圆弧的点集
     * @param radius 圆弧的半径
     * @param center 圆弧的中心点
     * @param offset 偏移量
     * @returns 偏移后的点集
     */
    private static offsetArc(points: THREE.Vector2[], radius: number, center: THREE.Vector2, offset: number): THREE.Vector2[] {
        const offsetPoints: THREE.Vector2[] = [];
        const newRadius = radius + offset;

        for (const point of points) {
            const direction = point.clone().sub(center).normalize();
            const offsetPoint = center.clone().add(direction.multiplyScalar(newRadius));
            offsetPoints.push(offsetPoint);
        }

        return offsetPoints;
    }

    /**
     * 计算点在直线上的投影点
     * @param point 点
     * @param line 线段，包含起点和终点
     * @returns 投影点
     */
    public static projectPointToLine(
        point: THREE.Vector3,
        line: { start: THREE.Vector3; end: THREE.Vector3 }
    ): THREE.Vector3 {
        const lineDirection = new THREE.Vector3().subVectors(line.end, line.start).normalize();
        const pointToStart = new THREE.Vector3().subVectors(point, line.start);
        const projectionLength = pointToStart.dot(lineDirection);
        return new THREE.Vector3().copy(line.start).addScaledVector(lineDirection, projectionLength);
    }
}