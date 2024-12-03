import React, { useState, useEffect } from 'react';
import { createComment, fetchComments, deleteComment, updateComment, fetchUserId } from '../services/commentService';

const ManageComments = ({ studyId, studyDetails, userInfo, selectedDate }) => {
  // 댓글 데이터 상태 관리
  const [userId, setUserId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // 수정 상태 관리
  const [editingCommentId, setEditingCommentId] = useState(null); 
  const [editingCommentContent, setEditingCommentContent] = useState(''); 
  // console.log('studyId :', studyId);
  // console.log('studyDetails :', studyDetails);
  // console.log('userInfo :', userInfo);

  // 사용자 ID 조회
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const id = await fetchUserId(); // userInfo.token이 필요
        setUserId(id);  // userId 상태 설정
      } catch (error) {
        console.error('사용자 ID 불러오기 실패:', error);
      }
    };
    loadUserId();
  }, []);

  // 댓글 조회
  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await fetchComments(studyId); // 댓글 목록을 받아옴
        const fetchedComments = response.data.comments.map((comment) => {
          // userInfo에서 userId와 일치하는 정보 찾기
          const user = userInfo.find((user) => user.id === comment.userId); 
          return {
            id: comment.commentId,
            userId: comment.userId, // 댓글 작성자 ID
            nickname: user ? user.nickname : '알 수 없음', // 작성자 닉네임
            profileImage: user ? user.image : '', // 작성자 프로필 이미지
            content: comment.content,
            date: comment.date || new Date().toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        });

        // 댓글 데이터가 없으면 빈 배열을 설정
        if (fetchedComments.length === 0) {
          setComments([]);  // 댓글이 없으면 빈 배열로 설정
        } else {
          setComments(fetchedComments.reverse()); // 댓글이 있으면 업데이트
        }
      } catch (error) {
        // console.error('댓글 데이터 불러오기 실패:', error);
        setComments([]); // 댓글 조회 실패 시 빈 배열로 설정
      }
    };
    loadComments();
  }, [studyId, selectedDate]);

  // 댓글 추가
  const handleAddComment = async () => {
    if (newComment.trim() === '') { alert('댓글을 입력하세요.'); return; }

    try {
      const response = await createComment(
        studyId, // studyId
        userId, // userId: 현재 로그인한 사용자 ID
        studyDetails.id, // groupId
        newComment // 댓글 내용
      );
      // 로그인한 사용자 정보 가져오기 (userInfo에서 userId와 일치하는 정보 찾기)
      const currentUser = userInfo.find((user) => user.id === userId);
      const newCommentData = {
        id: response.data.commentId,
        userId: userId,
        nickname: currentUser ? currentUser.nickname : '알 수 없음', // 현재 로그인한 사용자 nickname
        profileImage: currentUser ? currentUser.image : '', // 현재 로그인한 사용자 이미지
        content: response.data.content,
        date: new Date().toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setComments([newCommentData, ...comments]); // 새로운 댓글을 기존 상태 앞에 추가
      setNewComment(''); // 입력 필드 초기화
    } catch (error) {
      console.error('댓글 생성 실패:', error);
      alert('댓글 생성에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {

    const confirmDelete = window.confirm('정말 이 댓글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const response = await deleteComment(commentId); // 서버에서 댓글 삭제

      if (response.success) {
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      } else {
        alert('댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 댓글 수정 시작
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  // 댓글 수정 저장
  const handleSaveEdit = async () => {
    if (editingCommentContent.trim() === '') { alert('댓글 내용을 입력하세요.'); return; }

    try {
      const response = await updateComment( editingCommentId, editingCommentContent );

      if (response.success) {
        // 수정된 댓글 데이터 업데이트
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === editingCommentId
              ? {
                  ...comment,
                  content: editingCommentContent,
                  date: new Date().toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                }
              : comment
          )
        );
        setEditingCommentId(null);
        setEditingCommentContent('');
      } else {
        alert('댓글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  if (!userId) { return <div>로딩 중...</div>; }

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
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={comment.profileImage}
                  alt={`${comment.nickname} profile`}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{comment.nickname}</span>
                    <span className="text-gray-400 text-sm">{comment.date}</span>
                  </div>
                </div>
              </div>

              {/* 댓글 수정 부분 */}
              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 mt-4"
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-[#8CC29E] text-white text-[14px] px-3 py-1 rounded-lg"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 text-sm px-3 py-1 rounded-lg"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 mt-4">{comment.content}</p>
              )}

              {/* 수정 및 삭제 버튼 */}
              {!editingCommentId && (
                <div className="flex justify-end space-x-1 mt-2">
                  <button
                    onClick={() => handleEditComment(comment)} // 수정 버튼 클릭 시 수정 시작
                    className="text-gray-400 text-sm"
                  >
                    수정
                  </button>
                  <span className="text-gray-400 text-sm">/</span>
                  <button
                    onClick={() => handleDeleteComment(comment.id)} // 삭제 함수
                    className="text-gray-400 text-sm"
                  >
                    삭제
                  </button>
                </div>
              )}  
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default ManageComments;