const useScrollToBottom = (targetRef, containerRef) => {
  const scrollToBottom = () => {
    if (!targetRef.current) return;
    containerRef.current.scrollTop = targetRef.current.offsetTop;
  };
  return scrollToBottom;
};

export default useScrollToBottom;
