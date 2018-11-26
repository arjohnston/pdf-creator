import React, { Component } from 'react'
import Header from './components/header/Header'
import './App.css'

import { PDFExport } from '@progress/kendo-react-pdf'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'

const PORTRAIT_HEIGHT = 792
const PORTRAIT_WIDTH = 612
const LANDSCAPE_HEIGHT = PORTRAIT_WIDTH
const LANDSCAPE_WIDTH = PORTRAIT_HEIGHT

// maybe try out https://github.com/chenglou/react-motion/blob/master/demos/demo8-draggable-list/Demo.jsx

class App extends Component {
  constructor () {
    super()

    this.state = {
      portrait: false,
      fileName: 'unknown',
      title: 'file_name.pdf',
      subtitle: 'Subtitle',
      subject: '',
      keywords: '',
      items: [],
      editOpen: false,
      editTitle: '',
      editSubtitle: ''
    }
    this.onSortEnd = this.onSortEnd.bind(this)
  }

  downloadPDF () {
    let callback = () => {
      this.setState({
        previewerFullScreen: false
      })
    }

    this.setState({
      previewerFullScreen: true
    }, () => {
      this.document.save()
      setTimeout(() => { callback() }, 1500)
    })
  }

  // updateTitle (event) {
  //   this.setState({
  //     title: event.target.value
  //   })
  // }

  // updateSubtitle (event) {
  //   this.setState({
  //     subtitle: event.target.value
  //   })
  // }

  togglePreviewerFullscreen () {
    this.setState({
      previewerFullScreen: !this.state.previewerFullScreen
    })
  }

  onSortEnd ({ oldIndex, newIndex }) {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex)
    })
  }

  addItem () {
    let items = [ ...this.state.items ]

    items.push({
      name: this.state.editTitle
    })

    this.setState({
      items: items,
      editOpen: false,

      // close submenu if open
      submenuOpen: null
    })
  }

  deleteItem (index) {
    let items = [ ...this.state.items ]

    items.splice(index, 1)

    this.setState({
      items: items,
      submenuOpen: null
    })
  }

  editItem (index) {
    // this.openSubmenu(index)
    this.toggleEditorOpen(index)
    // console.log('edit: ', this.state.items[index])
  }

  openSubmenu (index) {
    let newIndex = index
    if (newIndex === this.state.submenuOpen) newIndex = null

    this.setState({
      submenuOpen: newIndex
    })
  }

  toggleEditorOpen (index = null) {
    console.log('i: ', index)
    // console.log('m: ', this.state.items[index].name)
    this.setState({
      editOpen: true,
      editScreenIndex: index
    })
  }

  toggleEditorClose () {
    this.setState({
      editOpen: false,
      editScreenIndex: null
    })
  }

  handleEditChange (val, e) {
    switch (val) {
      case 'editTitle':
        this.setState({
          editTitle: e.target.value
        })
        break

      case 'editSubtitle':
        this.setState({
          editSubtitle: e.target.value
        })
        break

      default:
        console.log('...')
    }
  }

  renderDocumentContent () {
    return this.state.items.map((item, index) => {
      return <div key={index}>{item.name}</div>
    })
  }

  render () {
    let documentStyle = {
      height: this.state.portrait ? PORTRAIT_HEIGHT : LANDSCAPE_HEIGHT,
      width: this.state.portrait ? PORTRAIT_WIDTH : LANDSCAPE_WIDTH
    }

    const SortableItem = SortableElement(({ value, position }) =>
      <li className={`form-child${position === this.state.submenuOpen ? ' is-open' : ''}`}>
        <div className='label' onClick={this.openSubmenu.bind(this, position)}>
          {/* More items to be added here... */}
          {value.name}
        </div>
        <div className='cta'>
          <div className='circle-button' onClick={this.editItem.bind(this, position)}>
            <svg viewBox='0 0 24 24'>
              <path fill='#FFF' d='M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z' />
            </svg>
          </div>

          <div className='circle-button' onClick={this.deleteItem.bind(this, position)}>
            <svg viewBox='0 0 24 24'>
              <path fill='#FFF' d='M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z' />
            </svg>
          </div>
        </div>
      </li>
    )

    const SortableList = SortableContainer(({ items }) => {
      return (
        <ul className='form-children'>
          {items.map((value, index) => (
            <SortableItem
              key={`item-${index}`}
              index={index}
              value={value}
              position={index}
            />
          ))}
        </ul>
      )
    })

    return (
      <div className='wrapper'>
        <Header />
        <div className='col'>
          <div className='form-viewport'>
            <div className={`form${this.state.editOpen ? ' edit-open' : ''}`}>
              <div className='form-wrapper'>
                <div className='form-children'>
                  <div className='form-child no-submenu'>
                    <div className='label'>
                      <span>{this.state.title}</span>
                      <span>{this.state.subtitle}</span>
                    </div>
                  </div>
                  <div className='form-child one-submenu'>
                    <div className='label'>
                      <span>Document Information</span>
                    </div>
                    <div className='cta'>
                      <div className='circle-button' onClick={this.editItem.bind(this)}>
                        <svg viewBox='0 0 24 24'>
                          <path fill='#FFF' d='M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z' />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <SortableList
                  items={this.state.items}
                  onSortEnd={this.onSortEnd}
                  distance={10}
                  lockToContainerEdges
                  helperClass='draggable-style'
                />
                <div
                  className='create-new'
                  onClick={this.toggleEditorOpen.bind(this, null)}
                >
                  <svg viewBox='0 0 24 24'>
                    <path fill='#FFFFFF' d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z' />
                  </svg>
                </div>
              </div>

              <div className='form-edit'>
                <div className='form-edit-wrapper'>
                  <input
                    type='text'
                    // value={this.state.editTitle}
                    // value={this.state.editScreenIndex ? this.state.items[this.state.editScreenIndex].name : ''}
                    placeholder='title'
                    onChange={this.handleEditChange.bind(this, 'editTitle')}
                  />
                  <input
                    type='text'
                    value={this.state.editSubtitle}
                    placeholder='subtitle'
                    onChange={this.handleEditChange.bind(this, 'editSubtitle')}
                  />
                </div>

                <div
                  className='create-new'
                  onClick={this.addItem.bind(this)}
                  style={{ backgroundColor: '#FFF' }}
                >
                  {this.state.editScreenIndex !== null
                    ? <svg viewBox='0 0 24 24'>
                      <path fill='#0794D3' d='M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z' />
                    </svg>
                    : <svg viewBox='0 0 24 24'>
                      <path fill='#0794D3' d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z' />
                    </svg>
                  }
                  {/* {this.state.editScreenIndex !== null ? 'e' : 'c'} */}
                </div>

                <div className='back' onClick={this.toggleEditorClose.bind(this)}>
                  <svg viewBox='0 0 24 24'>
                    <path fill='#0794D3' d='M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z' />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col'>
          <div className='button' onClick={this.downloadPDF.bind(this)}>
            <svg viewBox='0 0 24 24'>
              <path fill='#FFF' d='M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z' />
            </svg>
            Download
          </div>
          <div className='button'>
            <svg viewBox='0 0 24 24'>
              <path fill='#FFF' d='M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z' />
            </svg>
            Save
          </div>

          <div className={`previewer${this.state.previewerFullScreen ? ' full-screen' : ''}`} onClick={this.togglePreviewerFullscreen.bind(this)}>
            <PDFExport paperSize={'Letter'}
              fileName={`${this.state.fileName}.pdf`}
              title={this.state.title}
              subject={this.state.subject}
              keywords={this.state.keywords}
              landscape={!this.state.portrait}
              ref={(r) => { this.document = r }}
            >
              <div style={documentStyle} className='document'>
                {this.state.title}
                {/* <img src='cookie.svg' alt='cookie' /> */}
                {this.renderDocumentContent()}
              </div>
            </PDFExport>
          </div>

          <div>
            <div style={{ height: documentStyle.height, width: documentStyle.width, display: this.state.previewerFullScreen ? 'block' : 'none' }} className='document placeholder' />
          </div>
        </div>
      </div>
    )
  }
}

export default App
