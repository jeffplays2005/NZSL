using System.ComponentModel.DataAnnotations;

namespace A1_jji134.Models {
    public class Comment {
        /**
        * The comment ID, uniquely identifies each comment based on an int.
        * Primary key (PK)
        */
        [Key]
        public int Id { get; set;}
        /**
        * Timestamp of when the comment is inserted into the database.
        * Assigned when the comment is written to the database.
        * Format: yyyyMMddTHHmmssZ
        * year, month, date, T(serperator), hour, minute, second, Z(utc)
        */
        public string Time { get; set;}
        /**
        * The comment that the user writes.
        */
        public string UserComment { get; set;}
        /**
        * Name of the user that writes the comment.
        */
        public string Name { get; set;}
        /**
        * The IP address of the user that writes the comment.
        * Obtained through the Request.HttpContext.Connection.RemoteIpAddress property.
        */
        public string IP { get; set;}
    }
}
