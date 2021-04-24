import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Icon, Confirm } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";

export default function DeleteButton({ postId, callback }) {
  const [confirm, setConfirm] = useState(false);

  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    variables: { postId },
    update(proxy) {
      setConfirm(false);
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      let newData = data.getPosts.filter(post => post.id !== postId);
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          ...data,
          getPosts: {
            newData,
          },
        },
      });
      if (callback) callback();
    },
  });

  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => setConfirm(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={deletePost}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
