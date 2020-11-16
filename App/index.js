import React from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Image,
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
    marginBottom: 10,
    marginTop: 20,
  },
  searchButton: {
    width: 25,
    height: 25,
    marginRight: 10,
    position: "relative",
    textAlignVertical: "auto",
    tintColor: "#ff8d01",
    flex: 1,
    flexDirection: "row",
  },
});

class App extends React.Component {
  state = {
    articles: [],
    loading: true,
    category: "technology",
    searchOpen: false,
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
    const { articles, category, searchOpen } = this.state;
    return (
      <SafeAreaView>
        <FlatList
          data={articles}
          ListHeaderComponent={
            <View>
              <Text style={styles.headerText}>Top Headlines</Text>
              {searchOpen ? (
                <SearchBar
                  onSearch={() => this.requestTopHeadlines(category)}
                  searchButtonEnabled={category.length >= 1}
                  onChangeText={(text) => this.setState({ category: text })}
                  onPress={() => this.setState({ searchOpen: !searchOpen })}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => this.setState({ searchOpen: !searchOpen })}
                >
                  <Image
                    source={require("./assets/search.png")}
                    resizeMode="contain"
                    style={styles.searchButton}
                  />
                </TouchableOpacity>
              )}
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
