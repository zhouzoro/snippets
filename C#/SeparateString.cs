using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Ch06Ex05
{
    public class SeparateString
    {
        //Separate strO with string septor, return a string array;
        public string[] sepStr(string strO, string septor)
        {
            string[] separator = { septor };
            string[] after = strO.Split(setor, StringSplitOptions.RemoveEmptyEntries);
            return after;
        }

        //Separate strO with string septor, return a string array no more than outnum;
        public string[] sepStr(string strO, string septor, int outnum)
        {
            string[] separator = { septor };
            string[] after = strO.Split(separator,outnum, StringSplitOptions.RemoveEmptyEntries);
            return after;
        }

        //Separate strO with space, return a string array;
        public string[] sepStrwithSpa(string strO)
        {
            string[] separator = {" "};
            string[] after = strO.Split(separator, StringSplitOptions.RemoveEmptyEntries);
            return after;
        }

        //Separate strO with space, return a string array no more than outnum;
        public string[] sepStrwithSpa(string strO, int outnum)
        {
            string[] separator = { " " };
            string[] after = strO.Split(separator, outnum, StringSplitOptions.RemoveEmptyEntries);
            return after;
        }
    }
}
