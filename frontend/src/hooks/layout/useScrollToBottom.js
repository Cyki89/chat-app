const useScrollToBottom = (targetRef, containerRef) => {
  const scrollToBottom = () => {
    console.log("scrol to bottom");
    containerRef.current.scrollTop = targetRef.current.offsetTop;
  };
  return scrollToBottom;
};

export default useScrollToBottom;
