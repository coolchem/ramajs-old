$r.Class("HorizontalLayout").extends("LayoutBase")(function () {

    var paddingLeft = 10;
    var paddingRight = 10;
    var paddingTop = 10;
    var paddingBottom = 10;

    var verticalAlign = $r.VerticalAlign.TOP;

    var horizontalAlign = $r.HorizontalAlign.LEFT;

    this.updateLayout = function () {
        if(this.target)
        {
            var layoutTarget = this.target;
            var targetWidth = Math.max(0, layoutTarget.width - paddingLeft - paddingRight);
            var targetHeight = Math.max(0, layoutTarget.height - paddingTop - paddingBottom);

            var layoutElement
            var count = layoutTarget.elements.length;

           /* var containerHeight = targetHeight;
            if (verticalAlign == $r.VerticalAlign.CONTENT_JUSTIFY ||
                    (clipAndEnableScrolling && (verticalAlign == VerticalAlign.MIDDLE ||
                            verticalAlign == $r.VerticalAlign.BOTTOM)))
            {
                for (var i = 0; i < count; i++)
                {
                    layoutElement = layoutTarget.elements.source[i];
*//*                    if (!layoutElement || !layoutElement.includeInLayout)
                        continue;*//*

                    var layoutElementHeight;
                    if (!isNaN(layoutElement.percentHeight))
                        layoutElementHeight = calculatePercentHeight(layoutElement, targetHeight);
                    else
                        layoutElementHeight = layoutElement.getPreferredBoundsHeight();

                    containerHeight = Math.max(containerHeight, Math.ceil(layoutElementHeight));
                }
            }

            var excessWidth = distributeWidth(targetWidth, targetHeight, containerHeight);

            // default to top (0)
            var vAlign = 0;
            if (verticalAlign == $r.VerticalAlign.MIDDLE)
                vAlign = .5;
            else if (verticalAlign == $r.VerticalAlign.BOTTOM)
                vAlign = 1;

            var actualBaseline = 0;
            var alignToBaseline = verticalAlign == $r.VerticalAlign.BASELINE;
            if (alignToBaseline)
            {
                var result = calculateBaselineTopBottom(false *//*calculateBottom*//*);
                actualBaseline = result[0];
            }

            // If columnCount wasn't set, then as the LayoutElements are positioned
            // we'll count how many columns fall within the layoutTarget's scrollRect
            var visibleColumns = 0;
            var minVisibleX = layoutTarget.horizontalScrollPosition;
            var maxVisibleX = minVisibleX + targetWidth

            // Finally, position the LayoutElements and find the first/last
            // visible indices, the content size, and the number of
            // visible elements.
            var x = paddingLeft;
            var y0 = paddingTop;
            var maxX = paddingLeft;
            var maxY = paddingTop;
            var firstColInView = -1;
            var lastColInView = -1;

            // Take horizontalAlign into account
            if (excessWidth > 0)
            {
                var hAlign = horizontalAlign;
                if (hAlign == $r.HorizontalAlign.CENTER)
                {
                    x = paddingLeft + Math.round(excessWidth / 2);
                }
                else if (hAlign == $r.HorizontalAlign.RIGHT)
                {
                    x = paddingLeft + excessWidth;
                }
            }

            for (var index = 0; index < count; index++)
            {
                layoutElement = layoutTarget.elements.source[index];
*//*                if (!layoutElement || !layoutElement.includeInLayout)
                    continue;*//*

                // Set the layout element's position
                var dx = Math.ceil(layoutElement.getLayoutBoundsWidth());
                var dy = Math.ceil(layoutElement.getLayoutBoundsHeight());

                var y;
                if (alignToBaseline)
                {
                    var elementBaseline = layoutElement.baseline;
                    if (isNaN(elementBaseline))
                        elementBaseline = 0;

                    // Note: don't round the position. Rounding will case the text line to shift by
                    // a pixel and won't look aligned with the other element's text.
                    var baselinePosition = layoutElement.baselinePosition;
                    y = y0 + actualBaseline + elementBaseline - baselinePosition;
                }
                else
                {
                    y = y0 + (containerHeight - dy) * vAlign;
                    // In case we have VerticalAlign.MIDDLE we have to round
                    if (vAlign == 0.5)
                        y = Math.round(y);
                }

                layoutElement.setLayoutBoundsPosition(x, y);

                // Update maxX,Y, first,lastVisibleIndex, and x
                maxX = Math.max(maxX, x + dx);
                maxY = Math.max(maxY, y + dy);
                if (!clipAndEnableScrolling ||
                        ((x < maxVisibleX) && ((x + dx) > minVisibleX)) ||
                        ((dx <= 0) && ((x == maxVisibleX) || (x == minVisibleX))))
                {
                    visibleColumns += 1;
                    if (firstColInView == -1)
                        firstColInView = lastColInView = index;
                    else
                        lastColInView = index;
                }
                x += dx + gap;
            }

            setColumnCount(visibleColumns);
            setIndexInView(firstColInView, lastColInView);

            // Make sure that if the content spans partially over a pixel to the right/bottom,
            // the content size includes the whole pixel.
            layoutTarget.setContentSize(Math.ceil(maxX + paddingRight),
                    Math.ceil(maxY + paddingBottom));*/
        }

    };

})
