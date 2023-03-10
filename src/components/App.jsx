// Core
import { Component } from 'react';

// Utils
import toast, { Toaster } from 'react-hot-toast';

// API
import { PixabayAPI } from './../api';

// Styles
import { GlobalStyle } from './GlobalStyle';
import { Layout } from './Layout';

// Components
import { Searchbar } from './Searchbar';
import { ImageGallery } from './ImageGallery';
import { Button } from './Button';
import { Loader } from './Loader';

// CONSTANTS
const PIXABAY_PER_PAGE = 12;

export class App extends Component {
  state = {
    searchName: '',
    imgs: [],
    currentPage: 1,
    totalPages: null,
    error: null,
    isLoading: false,
  };

  componentDidUpdate(_, prevState) {
    if (
      prevState.searchName !== this.state.searchName ||
      prevState.currentPage !== this.state.currentPage
    )
      this.getImgs();
  }

  getImgs = async () => {
    try {
      this.setState({ isLoading: true, error: null });

      let { searchName, currentPage, imgs } = this.state;

      const response = await PixabayAPI(searchName, currentPage);
      if (currentPage === 1)
        this.setState({
          currentPage: 2,
        });

      const data = response.hits.map(
        ({ id, webformatURL, largeImageURL, tags }) => {
          return { id, webformatURL, largeImageURL, tags };
        }
      );

      this.setState({
        imgs: [...imgs, ...data],
        isLoading: false,
        totalPages: Math.ceil(response.totalHits / PIXABAY_PER_PAGE),
      });

      if (response.totalHits < 1)
        toast.error(
          'Sorry, we didn`t find any images according to your request.๐'
        );
    } catch {
      toast.error('Oops, something went wrong. Try reloading the page!๐คจ');
    }
  };

  handleSubmit = searchName => {
    // if (searchName === this.state.searchName) return;

    this.setState({
      searchName,
      imgs: [],
      currentPage: 1,
    });
  };

  onBtnClick = () => {
    this.setState(prevState => ({
      currentPage: prevState.currentPage + 1,
    }));
  };

  render() {
    const { imgs, isLoading, totalPages, currentPage } = this.state;

    return (
      <Layout>
        <Searchbar onSubmit={this.handleSubmit} />

        <ImageGallery data={imgs} />

        {imgs.length > PIXABAY_PER_PAGE &&
          totalPages !== currentPage &&
          !isLoading && (
            <>
              <Button onClick={this.onBtnClick} />
              <div ref={this.scrollToLoadMoreBtn} />
            </>
          )}

        {isLoading && <Loader />}

        <Toaster position="top-right" reverseOrder={false} />
        <GlobalStyle />
      </Layout>
    );
  }
}
