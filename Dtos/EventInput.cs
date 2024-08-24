using System.ComponentModel.DataAnnotations;

namespace A2_jji134.Dtos
{
    public class EventInputDto 
    {
        [Required]
        public string start { get; set; }
        [Required]
        public string end { get; set; }
        [Required]
        public string summary { get; set; }
        [Required]
        public string description { get; set; }
        [Required]
        public string location { get; set; }
    }
}