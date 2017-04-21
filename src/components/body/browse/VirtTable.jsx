//<editor-fold import
import React                                from 'react'
import {AutoSizer, InfiniteLoader, WindowScroller, List} from 'react-virtualized'
import table from './table'

export default class VirtTable extends React.Component {
  constructor(props, context){
    super(props)
    this.state = {
      showScrollingPlaceholder: false,
      useDynamicRowHeight: true
    }
    this.rowRenderer = this.rowRenderer.bind(this)
    this._getRowHeight - this._getRowHeight.bind(this)
    this._getDatum = this._getDatum.bind(this)
    this._getRowHeight = this._getRowHeight.bind(this)
  }

  _getDatum (index) {
    const { listings } = this.props;

    return listings.get(index % listings.length)
  }

  _getRowHeight ({ index }) {
    return this._getDatum(index).size
  }

  _noRowsRenderer () {
    return (
      <div className={table.row}>
        No rows
      </div>
    )
  }

  _onRowCountChange (event) {
    const rowCount = parseInt(event.target.value, 10) || 0

    this.setState({ rowCount })
  }

  _onScrollToRowChange (event) {
    const { rowCount } = this.state
    let scrollToIndex = Math.min(rowCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined
    }

    this.setState({ scrollToIndex })
  }

  rowRenderer ({ index, isScrolling, key, style }) {
      const {
        showScrollingPlaceholder,
        useDynamicRowHeight
      } = this.state

      if (
        showScrollingPlaceholder &&
        isScrolling
      ) {
        return (
          <div
            key={key}
            style={style}
            className={table.row}
          >
            Scrolling...
          </div>
        )
      }

      const datum = this.props.listings[index];

      let additionalContent

      let title = datum.title.replace(/\.|\!|\@|\#|\%|\^|\*|\=|\[|\]|\{|\}|\;|\:|\\|\<|\>|\_/g, '');

      if (title.length > 90) {
        title = title.substring(0, 90) + '…'
      }

      let price = datum.price;

      if (price > 6000) {
        price = null
      }

      return (
        <div
          // className={styles.row}
          key={key}
          style={style}
        >
          <div className={table.browseContainer}>
            <div className={table.browseItemDate}> 
              <div>{datum.post_date} </div>
              <div>
                <div style={{float: 'left', width: '50px'}}>{datum.price? <span>${datum.price}</span>: <span style={{color: '#bbb'}}>$??</span>}&nbsp;</div>
                <div style={{float: 'left'}}>{datum.bedrooms ? <span>{datum.bedrooms}BR</span>:<span style={{color: '#bbb'}}>?BR</span>}</div>
              </div>
            </div>
            <div style={{overflow: 'hidden'}} className={table.browseItemTitle}>
              <div>{title}</div>
              <div>{datum.neighborhood}</div>
            </div>
          </div>
        </div>
      )
    }

  render() {
    const list = this.props.listings;

    return (
      <div>
        <div style={{margin: '20px'}}>
          <p>Currently Active Listings ({list.length})</p>
        </div>
        <div style={{height: '75h', width: '40%', flex: '1 1 auto'}}>
          <AutoSizer>
            {({ height, width }) => (
              <List style={{margin: '0px 20px', border: '1px solid black'}}
                width={width}
                height={height}
                rowCount={list.length}
                rowHeight={80}
                rowRenderer={this.rowRenderer}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    )
  }
}