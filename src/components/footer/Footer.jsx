import React from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import footer from './footer.css'

export default class Footer extends React.Component {
  render() {
    return (
      <div className={footer.footerDiv}>
        <hr />
        <footer>
          <p>© Company 2016</p>
        </footer>
      </div>
    );
  }
}