import React from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";

import { client } from "news/App/graphql/client";
import { TopHeadlines } from "news/App/graphql/queries";
import { ArticleRow } from "news/App/components/ArticleRow";
import { SearchBar } from "news/App/components/SearchBar";

const styles = StyleSheet.create({
  headerText: {
    color: "#ff8d01",
    fontWeight: "bold",
    fontSize: 40,
    paddingHorizontal: 10,
    marginBottom: 30,
    marginTop: 10,
  },
});

class App extends React.Component {
  state = {
    articles: [],
    loading: true,
    category: "technology",
  };

  componentDidMount() {
    this.requestTopHeadlines(this.state.category);
  }

  requestTopHeadlines = (category) => {
    client
      .query({
        query: TopHeadlines,
        variables: { category },
      })
      .then((res) => {
        console.log("response", res);
        this.setState({
          loading: res.loading,
          articles: res.data.headlines.articles,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  renderFooter = () => {
    if (this.state.loading) {
      return <ActivityIndicator size="large" />;
    }

    return null;
  };

  render() {
    const { articles, category } = this.state;
    return (
      <SafeAreaView>
        <FlatList
          data={articles}
          ListHeaderComponent={
            <View>
              <Text style={styles.headerText}>Top Headlines</Text>
              <SearchBar
                onSearch={() => this.requestTopHeadlines(category)}
                searchButtonEnabled={category.length >= 1}
                onChangeText={(text) => this.setState({ category: text })}
              />
            </View>
          }
          renderItem={({ item, index }) => (
            <ArticleRow index={index} {...item} />
          )}
          keyExtractor={(item) => `${item.publishedAt}-${item.title}`}
          ListFooterComponent={this.renderFooter()}
        />
      </SafeAreaView>
    );
  }
}

export default App;
