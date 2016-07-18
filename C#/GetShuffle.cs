using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CardLib
{
    public class GetShuffle
    {
        public static int[] Shuffle(int Isequence)
        {
            int[] outseq = new int[Isequence];
            bool[] assigned = new bool[Isequence];
            Random sourceGen = new Random();
            for (int i = 0; i < Isequence; i++)
            {
                int sourceIs = 0;
                bool foundIs = false;
                while (foundIs == false)
                {
                    sourceIs = sourceGen.Next(Isequence);
                    if (assigned[sourceIs] == false)
                        foundIs = true;
                }
                assigned[sourceIs] = true;
                outseq[i] = sourceIs;
            }
            return outseq;
        }

        public static T[] Shuffle<T>(T[] Tsequence) 
        {
            int Isequence = Tsequence.Length;
            T[] outT = Tsequence;
            int[] Isfed = Shuffle(Isequence);
            for (int i = 0; i < Isequence; i++)
            {
                outT[i] = Tsequence[Isfed[i]];
            }
            return outT;
        }

        public static T Shuffle<T, U>(T Tsequence) where T : List<U>
        {
            int Isequence = Tsequence.Count;
            T outT = Tsequence;
            int[] Isfed = Shuffle(Isequence);
            for (int i = 0; i < Isequence; i++)
            {
                outT[i] = Tsequence[Isfed[i]];
            }
            return outT;
        }
    }
}
