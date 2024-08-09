using System.ComponentModel.DataAnnotations;

namespace A1_jji134.Dtos
{
    /**
    * Note that only the UserComment and Name from the Comment model is in this DTO.
    * This is because the Id, IP and Time are all generated it is stored in the database.
    */
    public class CommentInputDto
    {
        [Required]
        public string UserComment { get; set; }
        [Required]
        public string Name { get; set; }
    }
}