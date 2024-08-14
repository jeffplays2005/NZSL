using A1_jji134.Models;

namespace A1_jji134.Data
{
    public interface IA1Repo {
        // Comment database actions
        IEnumerable<Comment> GetAllComments();
        Comment GetCommentByID(int id);
        Comment AddComment(Comment comment);

        // Sign database actions
        IEnumerable<Sign> GetAllSigns();
        Sign GetSignByID(string id);
        Sign AddSign(Sign sign);
    }
}
