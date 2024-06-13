const notFoundHandler = (res, req, next) =>{
    res.status(404).json({
        message: 'Route not found',
      });
};
export default notFoundHandler;