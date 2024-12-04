import React, { useState, useEffect } from 'react';
import { fetchTasks, updateTaskStatus } from "../api/Task";

const ManageTasks = ({ 
  id, 
  studyId, 
  tasks=[], 
  setTasks, 
  onTaskUpdate,
  selectedDate }) => {
    const [progressPercentage, setProgressPercentage] = useState(0);

      // loadTasks 함수 정의
  const loadTasks = async () => {
    try {
      // 이미 tasks가 있을 경우에는 그대로 사용
      if (Array.isArray(tasks) && tasks.length > 0) {
        const updatedTasks = tasks.map((task) => ({
          id: task.id,
          content: task.content || task.label,
          checked: task.checked || task.taskStatus === "COMPLETED",
        }));
        setTasks(updatedTasks); // 부모 상태 직접 업데이트
        updateProgress(updatedTasks);
      } else {
        const response = await fetchTasks(id, studyId);
        if (response.success && response.data.length > 0) {
          const tasksData = response.data.map((task) => ({
            id: task.id,
            content: task.content,
            checked: task.taskStatus === "COMPLETED",
          }));
          setTasks(tasksData); // 부모 상태 업데이트
          updateProgress(tasksData);
        } else {
          setTasks([]); // tasks가 비어 있는 경우 초기화
          updateProgress([]); // 프로그레스바도 초기화
        }
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]); // 에러 발생 시 초기화
    }
  };

  useEffect(() => {
    loadTasks();
  }, [id, studyId, selectedDate]);

    // 체크 상태 업데이트
    const handleCheckboxChange = async (taskId, checked) => {
        try {
            const updatedStatus = checked ? "COMPLETED" : "PENDING";
            const response = await updateTaskStatus(taskId, updatedStatus);
            if (response.success) {
                const updatedTasks = tasks.map((task) =>
                    task.id === taskId ? { ...task, checked } : task
                );
                setTasks(updatedTasks);
                updateProgress(updatedTasks); // 업데이트된 `localTasks`로 프로그레스바 업데이트
                onTaskUpdate(taskId);
            }
        } catch (error) {
            console.error("Failed to update task status:", error);
        }
    };

    // 프로그레스바 업데이트
    const updateProgress = (tasks) => {
        const completedCount = tasks.filter((task) => task.checked).length; // `checked` 상태를 기준으로 완료된 과제 계산
        const totalCount = tasks.length;
        const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        setProgressPercentage(progress);
      };

  return (
    <div className="p-6">
      {/* 과제 텍스트와 프로그레스바 */}
      <div className="flex items-center mb-4 space-x-4">
        <p className="text-lg text-[#4B4B4B] mr-4">과제</p>
        <div className="w-[200px] h-4 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#8CC29E] rounded-full transition-width duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span className="text-[#5B5B5B]">{Math.round(progressPercentage)}%</span>
      </div>

      {/* 체크박스 리스트 */}
      <div>
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center mb-2.5 space-x-2">
            <input
              type="checkbox"
              checked={task.checked}
              onChange={(e) => handleCheckboxChange(task.id, e.target.checked)}
              className="mr-2"
            />
            <label className="text-[#4B4B4B]">{task.content}</label> {/* 텍스트 렌더링 */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTasks;