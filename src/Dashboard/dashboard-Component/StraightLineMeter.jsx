import React, { useMemo } from "react";

function StraightLineMeter({
    value = 0,
    min = 0,
    max = 100,
    width = 360,
    height = 14,
    ticks = 4,
    showValue = true,
    label = "",
    trackColor = '#e6eef8',
}) 
{
    const widthNum = Number(width) || 360;
    const heightNum = Number(height) || 14;
    const clamped = Math.min(Math.max(value, min), max);
    const pct = (clamped - min) / (max - min || 1);

    // compute padding to accommodate labels and ticks
    const paddingTop = 15; // space for value label
    const paddingBottom = 30 ; // space for tick labels and lines
    const sidePad = Math.max(20, Math.ceil(heightNum * 1.5)); // horizontal padding so end labels aren't clipped
    const innerWidth = Math.max(40, widthNum - sidePad * 2);
    const svgHeight = heightNum + paddingTop + paddingBottom;

    // horizontal margin to keep value label away from edges
    const edgeMargin = sidePad + 6;

    // compute tick positions inside innerWidth
    const tickPositions = useMemo(() => {
        const arr = [];
        for (let i = 0; i <= ticks; i++) {
            arr.push((i / ticks) * innerWidth);
        }
        return arr;
    }, [ticks, innerWidth]);

    // compute marker position inside innerWidth and clamp inside side padding
    const markerX = sidePad + pct * innerWidth;
    const markerXClamped = Math.max(sidePad, Math.min(markerX, sidePad + innerWidth));

    // derive a formal status message from the percentage (suitable for enterprise/marketing pages)
    const status = useMemo(() => {
        const percent = Math.round(pct * 100);
        if (percent <= 20) {
            return {
                title: 'Critical',
                description: 'Immediate attention required — the measured value is critically low and falls well below expected thresholds.',
                dot: 'bg-red-600',
                text: 'text-red-700'
            };
        }
        if (percent <= 40) {
            return {
                title: 'Below Expectations',
                description: 'Performance is below expectations. Investigate potential issues and consider corrective actions.',
                dot: 'bg-amber-500',
                text: 'text-amber-700'
            };
        }
        if (percent <= 60) {
            return {
                title: 'Satisfactory',
                description: 'Meets the minimum criteria. There is room for improvement to reach higher standards.',
                dot: 'bg-yellow-500',
                text: 'text-yellow-700'
            };
        }
        if (percent <= 80) {
            return {
                title: 'Good',
                description: 'Performance is good and aligns with established expectations.',
                dot: 'bg-green-500',
                text: 'text-green-700'
            };
        }
        return {
            title: 'Excellent',
            description: 'Outstanding performance — the measured value exceeds expectations.',
            dot: 'bg-sky-600',
            text: 'text-sky-700'
        };
    }, [pct]);

    return (
        <div className="w-full">
            {label && <div className="mb-2 text-sm text-[#097bed]">{label}</div>}

            <svg
                width="100%"
                height={svgHeight}
                viewBox={`0 0 ${widthNum} ${svgHeight}`}
                preserveAspectRatio="xMinYMid meet"
                style={{ display: 'block' }}
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label={label || 'meter'}
            >
                {/* background track */}
                <rect
                    x={sidePad}
                    y={paddingTop}
                    rx={heightNum / 2}
                    width={innerWidth}
                    height={heightNum}
                    fill={trackColor}
                />

                {/* filled portion (gradient) - animate width changes */}
                <defs>
                    <linearGradient id="grad-meter" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>

                <rect
                    x={sidePad}
                    y={paddingTop}
                    rx={heightNum / 2}
                    width={markerXClamped - sidePad}
                    height={heightNum}
                    fill="url(#grad-meter)"
                    style={{ transition: 'width 420ms cubic-bezier(.22, .99, .36, 1)' }}
                />

                {/* ticks: show only first, middle, last labels to avoid clutter */}
                {tickPositions.map((x, i) => {
                    const showLabel = i === 0 || i === ticks || i === Math.floor(ticks / 2);
                    const tickX = sidePad + x; // offset into inner area
                    const tickLineTop = paddingTop + heightNum + 6;
                    const tickLineBottom = paddingTop + heightNum + (showLabel ? 14 : 8);
                    const labelY = paddingTop + heightNum + 34;

                    return (
                        <g key={i} transform={`translate(${tickX}, 0)`}>
                            <line
                                x1={0}
                                y1={tickLineTop}
                                x2={0}
                                y2={tickLineBottom}
                                stroke="#9ca3af"
                                strokeWidth={1}
                                strokeLinecap="round"
                            />
                            {showLabel && (
                                <text
                                    x={0}
                                    y={labelY}
                                    fontSize={11}
                                    textAnchor="middle"
                                    fill="#374151"
                                >
                                    {Math.round(min + (i / ticks) * (max - min))}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* marker */}
                <g transform={`translate(${markerXClamped}, ${paddingTop + heightNum / 2})`}>
                    <filter id="meter-shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.12" />
                    </filter>
                    <circle r={14} fill="#fff" stroke="#e5e7eb" strokeWidth={1} filter="url(#meter-shadow)" />
                    <circle r={9} fill="#111827" style={{ transition: 'transform 420ms cubic-bezier(.22, .99, .36, 1)' }} />
                </g>

                {/* value label above marker */}
                {showValue && (
                    <text
                        x={Math.max(edgeMargin, Math.min(markerXClamped, widthNum - edgeMargin))}
                        y={paddingTop-8}
                        fontSize={18}
                        textAnchor="middle"
                        fill="#0f172a"
                        style={{ transition: 'x 420ms cubic-bezier(.22, .99, .36, 1)', fontWeight: 500 }}
                    >
                        {clamped}
                    </text>
                )}
            </svg>

            {/* formal status message */}
            <div className="mt-3 flex items-start gap-3" aria-live="polite">
                <span className={`flex-shrink-0 mt-1 inline-flex h-3 w-3 rounded-full ${status.dot}`} aria-hidden="true" />
                <div className="flex-1">
                    <div className={`text-sm font-semibold ${status.text}`}>{status.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{status.description}</div>
                </div>
            </div>
        </div>
    );
}

export default StraightLineMeter;