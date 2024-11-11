import React, { useState } from 'react';
import userImage from '../assets/userImage.png';

const ManageComments = () => {
  // 임의의 댓글 데이터
  const [comments, setComments] = useState([
    {
      id: 1,
      username: '오믈렛',
      content: 'C++ 강의 수강 마감 금일까지 입니다. 오늘 안으로 수강 부탁드립니다. 시간 확인, 잊지 말아주세요!',
      date: '2024.10.05 19:25',
      profileImage: userImage,
    },
    {
      id: 2,
      username: '오므라이스',
      content: '과제 제출 잊지 마세요!',
      date: '2024.10.03 14:12',
      profileImage: userImage,
    },
  ]);

  const [newComment, setNewComment] = useState('');

  // 댓글 추가 함수
  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      const newCommentData = {
        id: comments.length + 1,
        username: '오므라이스',
        content: newComment,
        date: new Date().toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        profileImage: userImage,
      };
      setComments([newCommentData, ...comments]);
      setNewComment('');
    }
  };

  return (
    <div className="p-6">
        {/* 댓글 등록 */}
        <p className="text-[#4B4B4B] mb-2">
            Task Feedback
        </p>
            <div className="flex items-center mb-2">
                <textarea
                type="text"
                className="flex-grow border border-gray-300 rounded-lg p-3 h-20 resize-none overflow-auto"
                placeholder="댓글을 입력하세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                />
            </div>
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleAddComment}
                    className="bg-[#8CC29E] text-white text-[14px] px-4 py-1.5 rounded-lg"
                    >
                    등록
                </button>
            </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-3">
                <img
                src={comment.profileImage}
                alt={`${comment.username} profile`}
                className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                <div className="flex items-center justify-between">
              <span className="text-gray-800">{comment.username}</span>
              <span className="text-gray-400 text-sm">{comment.date}</span>
            </div>
            </div>
          </div>
            <p className="text-gray-600 mt-2">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageComments;