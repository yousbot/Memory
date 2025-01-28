'use client';

import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

type Post = {
  id: string;
  text: string;
  images: string[];
};

export default function JournalApp() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleAddOrEdit = (newPost: Post) => {
    if (editingPost) {
      setPosts((prev) =>
        prev.map((post) => (post.id === editingPost.id ? newPost : post))
      );
    } else {
      setPosts((prev) => [...prev, newPost]);
    }
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Journal App</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-6"
        onClick={() => setIsModalOpen(true)}
      >
        Add Post
      </button>
      <div className="w-full max-w-3xl space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-md p-4 rounded-lg relative"
          >
            <p className="text-lg text-gray-800 font-medium">{post.text}</p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {post.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`post-${idx}`}
                  className="w-full h-32 object-cover rounded-md"
                />
              ))}
            </div>
            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                onClick={() => {
                  setEditingPost(post);
                  setIsModalOpen(true);
                }}
              >
                <PencilIcon className="h-5 w-5 text-gray-600" />
              </button>
              <button
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                onClick={() => handleDelete(post.id)}
              >
                <TrashIcon className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <PostModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingPost(null);
          }}
          onSave={handleAddOrEdit}
          editingPost={editingPost}
        />
      )}
    </div>
  );
}

function PostModal({
  onClose,
  onSave,
  editingPost,
}: {
  onClose: () => void;
  onSave: (post: Post) => void;
  editingPost: Post | null;
}) {
  const [text, setText] = useState(editingPost ? editingPost.text : "");
  const [images, setImages] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSave = () => {
    const id = editingPost ? editingPost.id : Date.now().toString();
    const imageUrls = images.map((file) => URL.createObjectURL(file));
    onSave({ id, text, images: imageUrls });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingPost ? "Edit Post" : "Add New Post"}
        </h2>
        <textarea
          className="w-full p-3 border rounded-md mb-4"
          placeholder="Write your post..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          multiple
          className="mb-4"
          onChange={handleImageChange}
        />
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
