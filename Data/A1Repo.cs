using Microsoft.EntityFrameworkCore.ChangeTracking;
using A1_jji134.Models;

namespace A1_jji134.Data
{
    public class A1Repo : IA1Repo
    {
        /**
        * Local DB context reference, injected through the constructor.
        */
        private readonly A1DbContext _dbContext;
        /**
        * DB Context constructor
        * @params A1DbContext The DB context.
        */
        public A1Repo(A1DbContext dbContext)
        {
            _dbContext = dbContext;
        }
        /**
        * Implement comment database methods
        */
        public IEnumerable<Comment> GetAllComments()
        {
            return _dbContext.Comments.ToList();
        }
        public Comment GetCommentByID(int id)
        {
            return _dbContext.Comments.FirstOrDefault(c => c.Id == id);
        }
        public Comment AddComment(Comment comment)
        {
            EntityEntry<Comment> e = _dbContext.Comments.Add(comment);
            Comment c = e.Entity;
            _dbContext.SaveChanges();
            return c;
        }

        /**
        * Implement sign database methods
        */
         public IEnumerable<Sign> GetAllSigns()
        {
            return _dbContext.Signs.ToList();
        }
        public Sign GetSignByID(int id)
        {
            return _dbContext.Signs.FirstOrDefault(s => s.Id == id);
        }
        public Sign AddSign(Sign sign)
        {
            EntityEntry<Sign> e = _dbContext.Signs.Add(sign);
            Sign s = e.Entity;
            _dbContext.SaveChanges();
            return s;
        }
    }
}
