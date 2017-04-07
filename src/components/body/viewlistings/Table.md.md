Table (component)

width (required): Pixel width.
  type: number

height of maxHeight: Pixel height of table.
  Either height or maxHeight must be specified.
  type: number

ownerHeight: 
Pixel height of table's owner, this is used in a managed scrolling situation when you want to slide the table up from below the fold without having to constantly update the height on every scroll tick. Instead, vary this property on scroll. By using ownerHeight, we over-render the table while making sure the footer and horizontal scrollbar of the table are visible when the current space for the table in view is smaller than the final, over-flowing height of table. It allows us to avoid resizing and reflowing table when it is moving in the view.
  This is used if ownerHeight < height (or maxHeight).
  type: number

overflowX: enum('hidden'|'auto')

overflowY: enum('hidden'|'auto')

rowsCount: number

rowHeight: Pixel height of rows unless rowHeightGetter is specified and returns different value.

rowHeightGetter (func): If specified, rowHeightGetter(index) is called for each row and the returned value overrides rowHeight for particular row.

rowClassNameGetter (func): To get any additional CSS classes that should be added to a row, rowClassNameGetter(index) is called.

groupHeaderHeight: Pixel height of the column group header.

headerHeight (required): Pixel height of header.

footerHeight: Pixel height of footer.

scrollLeft: Value of horizontal scroll. defaultValue: 0

scrollToColumn: Index of column to scroll to.

scrollTop: Value of vertical scroll. defaultValue: 0

scrollToRow: Index of row to scroll to.

onScrollStart: Callback that is called when scrolling starts with current horizontal and vertical scroll values.

onScrollEnd: Callback that is called when scrolling ends or stops with new horizontal and vertical scroll values.

onContentHeightChange: Callback that is called when rowHeightGetter returns a different height for a row than the rowHeight prop. This is necessary because initially table estimates heights of some parts of the content.

onRowClick: Callback that is called when a row is clicked.

onRowDoubleClick: Callback that is called when a row is double clicked.

onRowMouseDown:

onRowMouseEnter:

onRowMouseLeave

onColumnResizeEndCallback: Callback that is called when resizer has been released and column needs to be updated. Required if the isResizable property is true on any column.

function(
  newColumnWidth: number,
  columnKey: string,
)
type: func

isColumnResizing: Whether a column is currently being resized. type: bool