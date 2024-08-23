using System.ComponentModel.DataAnnotations;

namespace A2_jji134
{
    public class Sign
    {
        [Key]
        public string Id { get; set; }

        public string Description { get; set; }
    }
}